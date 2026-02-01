#!/bin/bash

# Directory containing the JSON files
directory="./dataengineer"

# Loop through all files matching the pattern "1 (X).json"
for file in "$directory"/*.json; do
    # Extract the number X from the filename
    number=$(echo "$file" | grep -oE '\([0-9]+\)' | sed 's/[()]//g')    
    # Construct the new filename
    new_filename="$directory-new/exam_$number.json"
    
    # Rename the file
    cp "$file" "$new_filename"
    
    echo "Renamed $file to $new_filename"
done