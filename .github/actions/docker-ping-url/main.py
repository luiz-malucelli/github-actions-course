import requests
import time
import os

def ping_url(url, delay, max_trials):
    trial = 1
    while (trial <= max_trials):
        try:
            response = requests.get(url)
            status_code = response.status_code
            if (status_code == 200):
                print(f"Success on trial {trial}")
                return True
            else:
                print(f"Status {status_code} on trial {trial}. Trying again in {delay} seconds...")
        except Exception as e:
            print(f"Exception on trial {trial}. Trying again in {delay} seconds...")

        trial += 1
        time.sleep(delay)

    print(f"Max trials exceeded")    
    return False


def run():
    url = os.environ.get('INPUT_URL')
    max_trials = int(os.environ.get('INPUT_MAX_TRIALS', 10))
    delay = int(os.environ.get('INPUT_DELAY', 5))
    output_path = os.environ.get("GITHUB_OUTPUT")

    print(f"url: {url}")
    print(f"max_trials: {max_trials}")
    print(f"delay: {delay}")

    website_reachable = ping_url(url, delay, max_trials)

    with open(output_path, "a") as f:
        print(f"url-reachable={website_reachable}", file=f)

    if not website_reachable:
        raise Exception(f"Website {url} is malformed or unreachable.")
    

if __name__ == "__main__":
    run()
    
