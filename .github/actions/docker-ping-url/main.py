import urllib.request
import time
import os

def ping_url(url, delay, max_trials):
    trial = 1
    while (trial <= max_trials):
        try:
            with urllib.request.urlopen(url) as response:
                status_code = response.getcode()
                if (status_code == '200'):
                    print(f"Success on trial {trial}")
                    return True
                else:
                    print(f"Status {status_code} on trial {trial}")
        except Exception as e:
            print(f"Exception on trial {trial}: {e}")

        trial += 1
        time.sleep(delay)

    print(f"Max trials exceeded")    
    return False


def run():
    url = os.environ.get('INPUT_URL')
    max_trials = int(os.environ.get('INPUT_MAX_TRIALS', 10))
    delay = int(os.environ.get('INPUT_DELAY', 5))

    print(f"url: {url}")
    print(f"max_trials: {max_trials}")
    print(f"delay: {delay}")

    ping_url(url, delay, max_trials)


if __name__ == "__main__":
    run()
    
