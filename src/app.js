
var HelloWorldLayer = cc.Layer.extend({
    isMouseDown:false,
    helloImg:null,
    helloLabel:null,
    circle:null,
    sprite:null,

    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        var size = cc.director.getWinSize();

        // add a "close" icon to exit the progress. it's an autorelease object
        var closeItem = cc.MenuItemImage.create(
            res.CloseNormal_png,
            res.CloseSelected_png,
            function () {
                cc.log("Menu is clicked!");
            },this);
        closeItem.attr({
            x: size.width - 20,
            y: 20,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var menu = cc.Menu.create(closeItem);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 1);

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        this.helloLabel = cc.LabelTTF.create("Hello World", "Arial", 38);
        // position the label on the center of the screen
        this.helloLabel.x = size.width / 2;
        this.helloLabel.y = 0;
        // add the label as a child to this layer
        this.addChild(this.helloLabel, 5);

        var lazyLayer = cc.Layer.create();
        this.addChild(lazyLayer);

        // add "HelloWorld" splash screen"
        this.sprite = cc.Sprite.create(res.HelloWorld_png);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2,
            scale: 0.5,
            rotation: 180
        });
        lazyLayer.addChild(this.sprite, 0);

        var rotateToA = cc.RotateTo.create(2, 0);
        var scaleToA = cc.ScaleTo.create(2, 1, 1);

        this.sprite.runAction(cc.Sequence.create(rotateToA, scaleToA));
        this.helloLabel.runAction(cc.Spawn.create(cc.MoveBy.create(2.5, cc.p(0, size.height - 40)),cc.TintTo.create(2.5,255,125,0)));

        pomeloChat();
        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

var pomeloChat = function() {
	var pomelo = window.pomelo;

	var route = 'gate.gateHandler.queryEntry';
	var uid = "uid";
	var rid = "rid";
	var username = "username";

	pomelo.init({
		host: "10.240.157.76",
		port: 3014,
		log: true
	}, function() {
		pomelo.request(route, {
			uid: uid
		}, function(data) {
			pomelo.disconnect();
			pomelo.init({
				host: data.host,
				port: data.port,
				log: true
			}, function() {
				var route = "connector.entryHandler.enter";
				pomelo.request(route, {
					username: username,
					rid: rid
				}, function(data) {
					cc.log(JSON.stringify(data));
					chatSend();
				});
			});
		});
	});

	function chatSend() {
		var route = "chat.chatHandler.send";
		var target = "*";
		var msg = "msg"
			pomelo.request(route, {
				rid: rid,
				content: msg,
				from: username,
				target: target
			}, function(data) {
				cc.log(JSON.stringify(data));
			});
	}
}
