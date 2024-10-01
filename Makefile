#default - first target in the file is launched by default
login: sso_login export_creds 

export_creds:
	eval "$(aws configure export-credentials --profile $(AWS_PROFILE) --format env)"

sso_login:
	aws sso login --profile $(AWS_PROFILE)
