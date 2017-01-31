data(users) {
  latestUsers = users;

  if (!intervalId) {
    intervalId = setInterval(() => {
      latestUsers.forEach(user => {
        this.request
          .getJSON(user.json)
          .then(json => {
            const time = this.request.time(json);
            if (json.file) {
              this.wrongLink(user.id);
              this.store.then(db => db.delete(user.id));
            } else if (user.watching) {
              this.build(user, json.buildStatus, json.last_build_number, json.last_build_id, time[0], time[1]);
            }
          });
      });
    }, 7000);
  }

  watching('Ok, since now I will watch for changes.');
}
