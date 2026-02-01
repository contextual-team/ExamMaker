#!/bin/bash

# Function to open a URL in Google Chrome
open_url() {
    url=$1
    echo "Opening $url in Google Chrome..."
    open -a "Google Chrome" $url
    echo "$url opened successfully."
}

# Base URL for the exams
base_url="https://www.examprepper.co/_next/data/ubu7_Wa4dIcd3btlaEowu/exam/10/"

# Open URLs for exams 1 through 64
for i in {1..64}
do
    url="$base_url$i/1.json"
    open_url $url
done