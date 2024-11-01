# CREATE EXTENSION pgcrypto;
# CREATE EXTENSION auth;


CONFIGURE CURRENT BRANCH SET
ext::auth::AuthConfig::auth_signing_key := 'F2KHaJfHi9Dzd8+6DI7FB9IFIoJXnhz2rzG/UzCRE7jTtYxqgTHHydc8xnN6emDB3tlR99FvPsyJfcVLVcQ5odSQpceDXplBOP+N14+EBy2mV6rA/7W7azIEKebtr9TVKrpBTMTOLAXo08ZnA6lvjn0VMs95za6Pta7VW62hjcb8jy6yxulvvU5SWnwa0x2z401K0pLK7byDD5eNqgTl40YaeOGoQ0iCkSmGxvLxyQgCIz2IU0zUbBwC9bQsTDORvflunruJznHuMxwbfYo/czQIIGuawU0H+G3GJZ3hecZLQlvwYCyLF37PFQVrcNMtUuGyDy2OyYtYHru2GW5B7Q';

CONFIGURE CURRENT BRANCH SET
ext::auth::AuthConfig::token_time_to_live := <duration>"24 hours";

CONFIGURE CURRENT BRANCH SET
ext::auth::AuthConfig::allowed_redirect_urls := {
	# Local setup
	'http://localhost:4173',

	# Local setup (dev)
	# 'http://localhost:5173',

	# Docker Compose setup
	# 'http://localhost:3000',
};

CONFIGURE CURRENT BRANCH RESET ext::auth::EmailPasswordProviderConfig;
CONFIGURE CURRENT BRANCH
INSERT ext::auth::EmailPasswordProviderConfig {
	require_verification := false,
};

# SMTP Configuration
CONFIGURE CURRENT BRANCH SET
ext::auth::SMTPConfig::sender := 'your-sender-email@example.com';
CONFIGURE CURRENT BRANCH SET
ext::auth::SMTPConfig::host := 'smtp';
CONFIGURE CURRENT BRANCH SET
ext::auth::SMTPConfig::port := <int32>25;
CONFIGURE CURRENT BRANCH SET
ext::auth::SMTPConfig::security := 'STARTTLSOrPlainText';
CONFIGURE CURRENT BRANCH SET
ext::auth::SMTPConfig::validate_certs := false;
