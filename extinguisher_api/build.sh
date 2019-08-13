
#! /bin/sh

#
#
#

# Setup basic environment
WORKSPACE=$(cd "$(dirname "$0")"; pwd)

# change dir
cd ${WORKSPACE}

# base info
MODULE=exApi
APP=${MODULE}
CONTROL=./control.sh
OUTPUT="./output"

# params
ACTION=${1}

# check environment
checkENV() {
    if [[ ${ENVIRONMENT} == "" ]];then
        echo "[ERROR] environment error!"
        exit -3
    fi
}

# build exApi jar, mvn log : warning
build() {
    # has mvn
    mvn -version > /dev/null 2>&1
    if [[ $? -ne 0 ]];then
        export MVN_HOME=/home/app/apache-maven-3.6.0/
        export PATH=$MVN_HOME/bin:$PATH
    fi
    # maven package
    mvn -Dorg.slf4j.simpleLogger.defaultLogLevel=warn clean package -P "${ENVIRONMENT}" -T 24 -Dmaven.test.skip=true
    local RET=$?
    if [[ ${RET} -ne 0 ]];then
        echo "[ERROR] ${APP} build failed!"
        exit ${RET}
    else
        echo "[INFO] ${APP} build successful!"
    fi
}

# output target, rename *.jar to kc_exam.jar
make_output() {
    # clean
    if [[ ! -e ${OUTPUT} ]];then
	mkdir -p ${OUTPUT}
    fi
    rm -rf ${OUTPUT}/* > /dev/null 2>&1
    #
    (
        \mv ./target/*.jar ${OUTPUT}/ && \
        \cp ${CONTROL} ${OUTPUT}/ && \
        \mv ${OUTPUT}/*.jar ${OUTPUT}/${APP}.jar && \
        echo "[INFO] make output successful!"
    ) || (
        echo "[ERROR] make output failed!" && exit -2;
    )
}

case ${ACTION} in
    "prod")
        ENVIRONMENT="prod";;
    "prev")
        ENVIRONMENT="prev";;
    "test")
        ENVIRONMENT="test";;
    *)
        ENVIRONMENT="";;
esac

## run
#
checkENV

#
build

#
make_output

#
echo "[INFO] all successful!"
exit 0
