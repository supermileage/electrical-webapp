FROM python:3

ENV VIRTUAL_ENV=/opt/venv
RUN python -m venv $VIRTUAL_ENV
ENV STATIC_URL /static
ENV STATIC_PATH /app/static
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

COPY requirements.txt .

RUN pip install --upgrade pip
RUN pip install uwsgi
RUN pip install -r requirements.txt

EXPOSE 5000

WORKDIR /app
CMD ["uwsgi", "/app/wsgi.ini"]