FROM alpine:3.17

# Copy the sdist archive
COPY dist/fantasion_backend-*.tar.gz /tmp/app.tar.gz

# Install system dependencies
# Install libs to build postresql bindings
# Install the application tarball
# Cleanup after installation
RUN \
  apk add --no-cache --update "python3~=3.10" py-pip py3-magic jpeg-dev libffi libwebp-dev zlib-dev libjpeg postgresql-libs tzdata && \
  apk add --no-cache --virtual .build-deps libffi-dev gcc python3-dev musl-dev postgresql-dev rust cargo && \
  pip install /tmp/app.tar.gz && \
  rm /tmp/app.tar.gz && \
  apk --purge del .build-deps

# Start Django
EXPOSE 80

CMD gunicorn -c /usr/lib/python3.10/site-packages/fantasion/gunicorn.py fantasion.wsgi
