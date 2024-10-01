# setup git user
git config --global user.email 'dantanzer@zerama.net'
git config --global user.name 'Dan Tanzer'

# install direnv
sudo apt-get update
sudo apt-get install -y direnv
echo 'eval "$(direnv hook zsh)"' >> ~/.zshrc

npm install -g aws-cdk # add cdk globally

# add some aliases
echo 'alias cd..="cd .."' >> ~/.zshrc
echo 'alias reload="source ~/.zshrc"' >> ~/.zshrc

echo 'echo "shell is reloaded"' >> ~/.zshrc

