for i in `seq 1 10`
do
	FILE=posts/post-$i.md
	hugo new $FILE
	echo "This is an answer to #$i question!" >> content/$FILE
done