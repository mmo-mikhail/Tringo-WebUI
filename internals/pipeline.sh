#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
WORKSPACE="$(dirname "$DIR")"

function check_error_exit
{
    if [ "$?" = "0" ]; then
	    echo "Stage succeeded!"
    else
        echo "Stage Error!" 1>&2
        exit 1
    fi
}

PROJECTNAME="tringo-web"
IMAGETAG="local"

echo "building source image"
cd $WORKSPACE/app
docker build  -t "${PROJECTNAME}_src":$IMAGETAG .
check_error_exit

# echo "running tests"
# docker run --rm "${PROJECTNAME}_src":$IMAGETAG npm run test
# check_error_exit

#delete intermediate image
docker rmi "${PROJECTNAME}_src":$IMAGETAG

echo "building release image"
cd $WORKSPACE
docker build -t "${PROJECTNAME}:${IMAGETAG}"  .
check_error_exit

echo "spinning docker service"
docker run -d --rm -p 3535:80 "${PROJECTNAME}":$IMAGETAG
check_error_exit
