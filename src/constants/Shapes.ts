export const SPRITES = {
    frames: {
        'blue': {
            frame: {x: 0, y: 0, w: 100, h: 100},
            sourceSize: {w: 100, h: 100},
            spriteSourceSize: {x: 0, y: 0, w: 100, h: 100}
        },
        'red': {
            frame: {x: 100, y: 0, w: 100, h: 100},
            sourceSize: {w: 100, h: 100},
            spriteSourceSize: {x: 0, y: 0, w: 100, h: 100}
        },
        'green': {
            frame: {x: 200, y: 0, w: 100, h: 100},
            sourceSize: {w: 100, h: 100},
            spriteSourceSize: {x: 0, y: 0, w: 100, h: 100}
        },
        'pink': {
            frame: {x: 300, y: 0, w: 100, h: 100},
            sourceSize: {w: 100, h: 100},
            spriteSourceSize: {x: 0, y: 0, w: 100, h: 100}
        },
        'yellow': {
            frame: {x: 400, y: 0, w: 100, h: 100},
            sourceSize: {w: 100, h: 100},
            spriteSourceSize: {x: 0, y: 0, w: 100, h: 100}
        },
        'orange': {
            frame: {x: 500, y: 0, w: 100, h: 100},
            sourceSize: {w: 100, h: 100},
            spriteSourceSize: {x: 0, y: 0, w: 100, h: 100}
        },
        'purple': {
            frame: {x: 600, y: 0, w: 100, h: 100},
            sourceSize: {w: 100, h: 100},
            spriteSourceSize: {x: 0, y: 0, w: 100, h: 100}
        }
    },
    meta: {
        image: 'img/square.png',
        format: 'RGBA8888',
        size: {w: 700, h: 100},
        scale: '1'
    },
}

export const SHAPES = [
    {
        shape: [
            [1, 1, 1, 1],
        ],
        color: 'blue'
    },
    {
        shape: [
            [2, 2, 2],
            [0, 2, 0],
        ],
        color: 'red'
    },
    {
        shape: [
            [3, 3],
            [3, 3],
        ],
        color: 'yellow',
    },
    {
        shape: [
            [4, 0],
            [4, 0],
            [4, 4],
        ],
        color: 'green',
    },
    {
        shape: [
            [0, 5],
            [0, 5],
            [5, 5],
        ],
        color: 'pink',
    },
    {
        shape: [
            [0, 6, 6],
            [6, 6, 0],
        ],
        color: 'orange',
    },
    {
        shape:
            [
                [7, 7, 0],
                [0, 7, 7],
            ],
        color: 'purple',
    }
]
