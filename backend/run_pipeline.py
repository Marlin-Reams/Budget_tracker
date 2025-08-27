import subprocess
import sys

def run_script(script_name):
    print(f" Running {script_name}...")
    result = subprocess.run(["python", script_name], capture_output=True, text=True)

    # Show the output
    print(result.stdout)
    if result.stderr:
        print(f" {script_name} errors:\n{result.stderr}", file=sys.stderr)

    return result.returncode == 0

def main():
    if run_script("scripts/fetch_emails.py"):
        print(" fetch_emails.py completed successfully.")
        if run_script("scripts/ingest.py"):
            print(" ingest.py completed successfully.")
        else:
            print(" ingest.py failed.")
    else:
        print(" fetch_emails.py failed. Aborting.")

if __name__ == "__main__":
    main()
