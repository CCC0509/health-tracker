FROM postgres:15

RUN apt-get update && \
    apt-get install -y locales && \
    sed -i '/zh_TW.UTF-8/s/^# //g' /etc/locale.gen && \
    locale-gen

ENV LANG=zh_TW.UTF-8
ENV LC_ALL=zh_TW.UTF-8
