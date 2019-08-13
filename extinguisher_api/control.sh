#!/bin/sh

# init
WORKSPACE=`cd $(dirname $0);pwd`
cd ${WORKSPACE}

# service info
APP="exApi"
JAVA_OPTS="-server -Xmx1024M"
SVCOUTLOG="exApi.out"
SVCERRLOG="exApi.err"
TIMEOUT="6"
SYSUSER=${USER}
USER="kaochong"

# params
ACTION=${1}

# user: kaochong
user() {
    if [[ ${USER} != ${SYSUSER} ]];then
	echo "current user: ${SYSUSER}, please use user: ${USER}, exit."
	exit 1
    fi
}

# start
start() {
    # check java
    java -version > /dev/null 2>&1
    if [[ $? -ne 0 ]];then
        echo "[ERROR] java not found."
        exit -1
    fi
    # check nohup
    NOHUP=`which nohup`
    if [[ $? -ne 0 ]];then
        echo "[ERROR] nohup not found."
        exit -2
    fi
    # start service
    # ${NOHUP} java ${JAVA_OPTS} -jar ${WORKSPACE}/${APP}.jar >>${WORKSPACE}/${SVCOUTLOG} 2>>${WORKSPACE}/${SVCERRLOG} &
    ${NOHUP} java ${JAVA_OPTS} -jar ${WORKSPACE}/${APP}.jar > /dev/null 2>${WORKSPACE}/${SVCERRLOG} &
    sleep 3
    status
}

# stop
stop() {
    local pid=$(getPID)
    if [ -z ${pid} ]; then
        echo "[ERROR] ${APP}.jar not runnning."
        exit 0
    fi
    let kwait=${TIMEOUT}
    count=0;
    until [ `ps -p ${pid} | grep -c ${pid}` = '0' ] || [ $count -gt $kwait ]
    do
      echo "[INFO] waiting for processes to exit"
      kill ${pid}
      sleep 1
      let count=$count+1;
    done
    if [ $count -gt $kwait ];then
      echo "[INFO] killing processes [${APP}.jar] after ${TIMEOUT} seconds"
      kill -9 ${pid} > /dev/null 2>&1
    fi
    echo "[INFO] stop ${APP}.jar successful."
}

# get pid
getPID() {
    pid=`ps aux | grep "/${APP}.jar" | grep -v grep | awk '{print $2}'`
    if [ -z ${pid} ]; then
        echo ""
    fi
    echo ${pid}
}

# status
status() {
    local pid=$(getPID)
    if [[ -z $pid ]];then
        echo "[WARN] ${APP}.jar not running."
    else
        echo "[INFO] ${APP}.jar running, pid: ${pid}"
    fi
}

# restart
restart() {
    local pid=$(getPID)
    if [ -z ${pid} ]; then
        echo "[ERROR] ${APP}.jar not runnning."
        start
    else
        stop
        sleep 1
        start
    fi
}

# display
display() {
    echo "usage: sh control.sh [start|stop|restart|status]"
}

case ${ACTION} in
    "start")
	user
        start;;
    "stop")
	user
        stop;;
    "restart")
	user
        restart;;
    "status")
	user
        status;;
    *)
        display;;
esac
