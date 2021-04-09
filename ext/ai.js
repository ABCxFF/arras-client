// Ponyo's ai
/*

	Auto Aim

	Information required for arguments
		player {
			x: Number,
			y: Number
		}
		target: {
			x: Number,
			y: Number,
			vx: Number,
			vy: Number
		}
		bulletSpeed: Number

*/
function autoAim(player, target, bulletSpeed, type = "b") {

	// vector
	const direction = {
		x: (target.x - player.x),
		y: (target.y - player.y)
	};
	const distance = Math.sqrt((direction.x ** 2) + (direction.y ** 2));
	const radian = Math.atan2(direction.y, direction.x);
	const targetSpeed = Math.sqrt((target.vx ** 2) + (target.vy ** 2));
	
	// ranch
	let time = 0.0;
	switch (type) {
		
		// type a
		case "a": {

			// ax^2 + bx + c = 0
			const a = ((target.vx ** 2) + (target.vy ** 2) - (bulletSpeed ** 2));
			const b = (2 * (direction.x * target.vx + direction.y * target.vy));
			const c = ((direction.x ** 2) + (direction.y ** 2));
	
			// time for the bullet to reach the target
			time = Math.sqrt((b ** 2) - (4 * a * c));
			if (!Number.isNaN(time)) {
				const times = new Array(2);
				times[0] = ((-b - time) / (2 * a));
				times[1] = ((-b + time) / (2 * a));
				switch (true) {
					case ((times[0] < 0) && (times[1] < 0)): {
						time = 0.0;
						break;
					}
					case (times[0] < 0): {
						time = times[1];
						break;
					}
					case (times[1] < 0): {
						time = times[0];
						break;
					}
					default: {
						time = (times[0] < times[1] ? times[0] : times[1]);
						break;
					}
				}
			} else {
				console.error("hit impossible (imaginary number)");
				time = 0.0;
			}
			break;

		}
	
		// type b
		case "b": {
			time = (distance / (bulletSpeed * Math.sqrt(1 - ((targetSpeed / bulletSpeed * Math.sin(radian)) ** 2)) - (targetSpeed * Math.cos(radian))));
			if (Number.isNaN(time) || (time < 0)) {
				console.error("hit impossible (imaginary number or negative number)");
				time = 0.0;
			}
			break;
		}

		// unknown
		default: {
			console.error("why lol");
			time = 0.0;
			break;
		}

	}

	// aim
	const input = {
		x: (direction.x + target.vx * time),
		y: (direction.y + target.vy * time)
	};
	return {
		x: input.x,
		y: input.y
	};

}
