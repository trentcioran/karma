var log4javascript = function () {
	this.nullLogger = function() {
		this.isDebugEnabled = function () { return false; };
		this.debug = function () {};
		this.error = function () {};
	};
	this.getNullLogger = this.nullLogger;
	this.getLogger = this.nullLogger;
};
