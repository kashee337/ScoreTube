
FROM python:3.8.6-buster
WORKDIR /opt/app
COPY ./* /opt/app/

RUN apt-get update && \
    apt-get install -y --no-install-recommends &&\
    pip install -U pip &&\
    pip install -r requirements.txt

EXPOSE 8080
CMD ["python", "app.py"]