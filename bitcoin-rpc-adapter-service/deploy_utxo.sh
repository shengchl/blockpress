#!/bin/sh
HOSTNAME=ec2-35-162-156-151.us-west-2.compute.amazonaws.com
USERNAME=ubuntu
KEYFILEPATH="/Users/sauron/NewestDropbox/Dropbox/BlockPressInc/InfrastructureEngineering/AWS/bp_ec2_keypair.pem"
echo "Starting deploy to server... $HOSTNAME"
rsync -rav -e "ssh -i $KEYFILEPATH"  --progress --exclude-from='./exclude_files_rsync.txt' ./ ubuntu@$HOSTNAME:~/bch_api_service
echo "\nDONE deploying to $HOSTNAME\n"

echo "\nDone. Bye..."
exit
