#!/bin/sh
HOSTNAME=ec2-35-163-22-130.us-west-2.compute.amazonaws.com
HOSTNAME2=ec2-54-203-1-96.us-west-2.compute.amazonaws.com
USERNAME=ubuntu
KEYFILEPATH="/PATH/TO/KEYFILE/AWS/ec2_keypair.pem"
echo "Starting deploy to server... $HOSTNAME"
echo "Deleting logs/*"
rm -rf log
echo "Deleting tmp/cache..."
rm -rf tmp/cache
rsync -rav -e "ssh -i $KEYFILEPATH"  --progress --exclude-from='./exclude_files_rsync.txt' ./ ubuntu@$HOSTNAME:~/app
echo "\nDONE deploying to $HOSTNAME\n"

rsync -rav -e "ssh -i $KEYFILEPATH"  --progress --exclude-from='./exclude_files_rsync.txt' ./ ubuntu@$HOSTNAME2:~/app
echo "\nDONE deploying to $HOSTNAME2\n"

echo "\nDone. Bye..."
exit
