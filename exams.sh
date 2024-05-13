#!/bin/bash

# Function to download a file from a URL
download_file() {
    url=$1
    filename=$2
    echo "Downloading $filename..."
    curl -sS $url -o $filename
    echo "$filename downloaded successfully."
}

# Base URL for the exams
base_url="https://www.examprepper.co/_next/data/oz1lCbdcNAQuZ5U7BjmRn/exam/5/"

# Download files for exams 1 through 30
for i in {1..34}
do
    url="$base_url$i/1.json"
    filename="exam_$i.json"
    download_file $url $filename
done
