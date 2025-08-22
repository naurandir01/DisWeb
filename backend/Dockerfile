FROM python:3.13


WORKDIR /backend
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
RUN apt update && apt install libmagic1 testdisk -y
COPY . .
RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]