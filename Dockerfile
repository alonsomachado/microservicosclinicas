FROM alpine
WORKDIR /servidor
RUN apk update
RUN apk fetch openjdk8
RUN apk add openjdk8
ENV JAVA_HOME=/usr/lib/jvm/java-1.8-openjdk
ENV PATH="$JAVA_HOME/bin:${PATH}"
COPY policy.all .
COPY Servidor.java .
COPY ClientMonitor.java .
COPY ServidorImpl.java .
COPY Client.java .
COPY run.sh .
RUN javac *.java
ENTRYPOINT chmod 777 /serverdata
ENTRYPOINT chmod 777 -R /servidor
ENTRYPOINT ./run.sh