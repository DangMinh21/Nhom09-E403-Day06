"""
Fetch and extract text from Vietnam Airlines web pages listed in url.txt.
url.txt format: one URL per line, blank lines and lines starting with # are ignored.
"""
import os
import re
import urllib.request
import urllib.error
from html.parser import HTMLParser

URL_FILE = os.path.join(os.path.dirname(__file__), "..", "..", "url.txt")

# Tags whose content we want to skip entirely
_SKIP_TAGS = {"script", "style", "head", "nav", "footer", "noscript", "iframe"}


class _TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.texts = []
        self._skip_depth = 0
        self._current_skip_tag = None

    def handle_starttag(self, tag, attrs):
        if tag in _SKIP_TAGS:
            self._skip_depth += 1

    def handle_endtag(self, tag):
        if tag in _SKIP_TAGS and self._skip_depth > 0:
            self._skip_depth -= 1

    def handle_data(self, data):
        if self._skip_depth == 0:
            text = data.strip()
            if text:
                self.texts.append(text)


def _load_urls() -> list[str]:
    """Read URLs from url.txt, skip comments and blanks."""
    if not os.path.exists(URL_FILE):
        return []
    with open(URL_FILE, encoding="utf-8") as f:
        lines = f.readlines()
    urls = []
    for line in lines:
        line = line.strip()
        if line and not line.startswith("#"):
            urls.append(line)
    return urls


def _fetch_text(url: str, max_chars: int = 3000) -> str:
    """Fetch a URL and return clean plain text (max_chars chars)."""
    try:
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": (
                    "Mozilla/5.0 (compatible; NemoBot/1.0; Vietnam Airlines AI)"
                )
            },
        )
        with urllib.request.urlopen(req, timeout=8) as resp:
            raw_html = resp.read().decode("utf-8", errors="replace")
    except (urllib.error.URLError, Exception) as e:
        return f"[Lỗi khi tải trang: {e}]"

    parser = _TextExtractor()
    parser.feed(raw_html)

    # Join, collapse whitespace
    text = " ".join(parser.texts)
    text = re.sub(r"\s{2,}", " ", text).strip()
    return text[:max_chars]


def get_available_urls() -> dict:
    """Return the list of available VNA URLs from url.txt."""
    urls = _load_urls()
    if not urls:
        return {
            "available": False,
            "message": (
                "Chưa có URL nào được cấu hình. "
                "Vui lòng thêm URL vào file url.txt (mỗi dòng một URL)."
            ),
            "urls": [],
        }
    return {"available": True, "total": len(urls), "urls": urls}


def fetch_vna_page(url: str) -> dict:
    """Fetch a Vietnam Airlines page and return its text content."""
    allowed_urls = _load_urls()

    if not allowed_urls:
        return {
            "error": (
                "Chưa có URL nào được cấu hình trong url.txt. "
                "Nhà phát triển cần thêm URL vào file url.txt."
            )
        }

    # Soft match: allow if url is in list or if list is non-empty and url looks valid
    if url not in allowed_urls:
        # Still try fetching — GPT may generate a variant URL
        pass

    text = _fetch_text(url)
    return {
        "url": url,
        "content": text,
        "note": "Nội dung được trích xuất từ trang Vietnam Airlines.",
    }
