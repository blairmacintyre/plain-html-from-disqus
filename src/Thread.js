const { URL } = require("url");

class Thread {
	constructor(threadObj) {
		this.threadId = threadObj.$['dsq:id'];
		this.thread = threadObj;
		this.url = new URL(threadObj.link[0]);
		this.path = this.url.pathname;
		this.posts = [];
	}

	getThreadId() {
		return this.threadId;
	}

	getPath() {
		return this.path;
	}

	getParentPostById(postId) {
		for(let post of this.posts) {
			if( post.getPostId() === postId ) {
				return post;
			}
		}
	}

	addPost(postInstance) {
		let parentPostId = postInstance.getParentPostId();
		if( parentPostId ) {
			let parentPostInstance = this.getParentPostById(parentPostId);
			if( !parentPostInstance ) {
				throw new Error(`Could not find parent post for ${parentPostId}`);
			}

			parentPostInstance.addReply(postInstance);
		}

		this.posts.push(postInstance);
	}

	getCount() {
		return this.posts.length;
	}

	isEmpty() {
		return this.posts.length === 0;
	}

	toObject() {
		return {
			// threadId: this.threadId,
			// date: this.thread.createdAt[0],
			// url: this.url.href,
			path: this.path,
			commentCount: this.posts.length,
			// title: this.thread.title[0],
			// message: this.thread.message[0],
			comments: this.posts.filter(post => {
				return !post.getParentPostId();
			}).map(post => {
				return post.toObject();
			})
		};
	}

	toString() {
		var output =  "<div class='commentURL'>" + this.path + "</div>\n" +
		  "<span id='oldComments'>\n" +
			"<h2>" + (this.posts.length > 1 ? this.posts.length.toString() + " Archived Comments</h2>" : "1 Archived Comment</h2>") + 
			"\n<ul class='comments archived'>\n"; 
		this.posts.filter(post => {
			return !post.getParentPostId();
		}).map(post => {
			output += post.toString();
		})
		return output + "</ul>\n</span>\n\n";
	}
}

/*
{ '$': { 'dsq:id': '1268213762' },
  id: [ '' ],
  forum: [ 'web367' ],
  category: [ { '$': [Object] } ],
  link: [ 'https://www.zachleat.com/web/conservative-design-patterns-for-form-elements/' ],
  title: [ 'Conservative Design Patterns for Form Elements' ],
  message: [ '' ],
  createdAt: [ '2007-02-23T08:26:29Z' ],
  author:
   [ { email: [Array],
       name: [Array],
       isAnonymous: [Array],
       username: [Array] } ],
  ipAddress: [ '127.0.0.1' ],
  isClosed: [ 'false' ],
  isDeleted: [ 'false' ] } */

module.exports = Thread;