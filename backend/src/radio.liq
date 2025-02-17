# Load all MP3 files from /app/tts_audio and shuffle them
radio = playlist.safe( "/app/tts_audio/", reload=0)
broken = single("/app/background.mp3")

safe_radio = fallback(track_sensitive=false, [radio, broken])

output.icecast(
  %mp3,
  host="icecast",  # Matches service name in docker-compose.yml
  port=8002,
  password="MySecurePass123",
  mount="/radio.mp3",
  fallible=true,
  safe_radio
)
