import sys
import os
import tempfile
from faster_whisper import WhisperModel

# optional dependency for downloading YouTube videos
try:
    from yt_dlp import YoutubeDL
except ImportError:
    YoutubeDL = None


def run():
    input_arg = sys.argv[1]  # may be a local path or a remote URL

    # if the argument looks like a URL and yt_dlp is available, download it
    if input_arg.startswith("http"):
        if YoutubeDL is None:
            raise RuntimeError(
                "yt_dlp is required to download remote videos. install with `pip install yt-dlp`."
            )
        tmp = tempfile.NamedTemporaryFile(suffix=".mp4", delete=False)
        tmp_path = tmp.name
        tmp.close()

        ydl_opts = {
            'outtmpl': tmp_path,
            'format': 'bestaudio'
        }
        with YoutubeDL(ydl_opts) as ydl:
            ydl.download([input_arg])
        target = tmp_path
    else:
        target = input_arg

    # Using 'tiny' model so it's fast and uses very little RAM
    model = WhisperModel("tiny", device="cpu", compute_type="int8")
    segments, _ = model.transcribe(target)
    text = "".join([s.text for s in segments])

    print(text)  # Node.js will "catch" this output

    # cleanup if we downloaded a file
    if target != input_arg and os.path.exists(target):
        try:
            os.unlink(target)
        except Exception:
            pass


if __name__ == "__main__":
    run()