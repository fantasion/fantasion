import os

port = os.environ.get('PORT', 80)
bind = '0.0.0.0:{port}'.format(port=port)  # noqa
proxy_allow_ips = '*'  # noqa
forwarded_allow_ips = '*'  # noqa
