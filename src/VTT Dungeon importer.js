var VTTImportData = 	[
	[
		{
			"x": 13,
			"y": 10
		},
		{
			"x": 16,
			"y": 10
		},
		{
			"x": 17,
			"y": 10
		},
		{
			"x": 13,
			"y": 10
		}
	],
	[
		{
			"x": 16,
			"y": 9
		},
		{
			"x": 16,
			"y": 10
		},
		{
			"x": 16,
			"y": 9
		}
	],
	[
		{
			"x": 15,
			"y": 9
		},
		{
			"x": 15,
			"y": 10
		},
		{
			"x": 15,
			"y": 9
		}
	],
	[
		{
			"x": 14,
			"y": 9
		},
		{
			"x": 14,
			"y": 10
		},
		{
			"x": 14,
			"y": 9
		}
	],
	[
		{
			"x": 13,
			"y": 9
		},
		{
			"x": 13,
			"y": 10
		},
		{
			"x": 13,
			"y": 9
		}
	],
	[
		{
			"x": 16,
			"y": 7
		},
		{
			"x": 16,
			"y": 8
		},
		{
			"x": 16,
			"y": 7
		}
	],
	[
		{
			"x": 15,
			"y": 7
		},
		{
			"x": 15,
			"y": 8
		},
		{
			"x": 15,
			"y": 7
		}
	],
	[
		{
			"x": 14,
			"y": 7
		},
		{
			"x": 14,
			"y": 8
		},
		{
			"x": 14,
			"y": 7
		}
	],
	[
		{
			"x": 13,
			"y": 8
		},
		{
			"x": 13,
			"y": 7
		},
		{
			"x": 13,
			"y": 8
		}
	],
	[
		{
			"x": 13,
			"y": 7
		},
		{
			"x": 17,
			"y": 7
		},
		{
			"x": 13,
			"y": 7
		}
	],
	[
		{
			"x": 16,
			"y": 6
		},
		{
			"x": 16,
			"y": 7
		},
		{
			"x": 16,
			"y": 6
		}
	],
	[
		{
			"x": 15,
			"y": 6
		},
		{
			"x": 15,
			"y": 7
		},
		{
			"x": 15,
			"y": 6
		}
	],
	[
		{
			"x": 14,
			"y": 6
		},
		{
			"x": 14,
			"y": 7
		},
		{
			"x": 14,
			"y": 6
		}
	],
	[
		{
			"x": 13,
			"y": 6
		},
		{
			"x": 13,
			"y": 7
		},
		{
			"x": 13,
			"y": 6
		}
	],
	[
		{
			"x": 15,
			"y": 4
		},
		{
			"x": 15,
			"y": 5
		},
		{
			"x": 15,
			"y": 4
		}
	],
	[
		{
			"x": 12,
			"y": 8.5
		},
		{
			"x": 12,
			"y": 9
		},
		{
			"x": 9,
			"y": 9
		},
		{
			"x": 9,
			"y": 7
		},
		{
			"x": 12,
			"y": 7
		},
		{
			"x": 12,
			"y": 7.5
		}
	],
	[
		{
			"x": 16,
			"y": 4
		},
		{
			"x": 16,
			"y": 5
		},
		{
			"x": 16,
			"y": 4
		}
	],
	[
		{
			"x": 14,
			"y": 4
		},
		{
			"x": 14,
			"y": 5
		},
		{
			"x": 14,
			"y": 4
		}
	],
	[
		{
			"x": 13,
			"y": 4
		},
		{
			"x": 13,
			"y": 5
		},
		{
			"x": 13,
			"y": 4
		}
	],
	[
		{
			"x": 11,
			"y": 4
		},
		{
			"x": 11,
			"y": 5
		},
		{
			"x": 12,
			"y": 5
		},
		{
			"x": 11,
			"y": 5
		},
		{
			"x": 11,
			"y": 4
		}
	],
	[
		{
			"x": 17,
			"y": 11
		},
		{
			"x": 17,
			"y": 11
		},
		{
			"x": 13,
			"y": 11
		}
	],
	[
		{
			"x": 12,
			"y": 11
		},
		{
			"x": 9,
			"y": 11
		},
		{
			"x": 9,
			"y": 4
		},
		{
			"x": 9.5,
			"y": 4
		}
	],
	[
		{
			"x": 10.5,
			"y": 4
		},
		{
			"x": 17,
			"y": 4
		},
		{
			"x": 17,
			"y": 10
		}
	]
]

var multiplier = 32;
VTTImportData.forEach(nugget => {
	for (let i = 0; i < nugget.length; i++) {
		const element = nugget[i];
		if(i>0){
			var graphics = this.add.graphics();
			graphics.lineStyle(5, 0x2ECC40);
			graphics.beginPath();

			graphics.moveTo(nugget[i-1].x*multiplier, nugget[i-1].y*multiplier);
			graphics.lineTo(nugget[i].x*multiplier, nugget[i].y*multiplier);
			graphics.closePath();
			graphics.strokePath();
			//console.log(nugget[i-1].x*multiplier, nugget[i-1].y*multiplier, nugget[i].x*multiplier, nugget[i].y*multiplier)
		}
	}
});