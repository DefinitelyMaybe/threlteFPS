export type Actions = {
	moveleft: 0 | 1;
	moveright: 0 | 1;
	moveforward: 0 | 1;
	movebackward: 0 | 1;
	jump: 0 | 1;
};

export type PlayerContext = {
	actions: Actions;
	grounded: boolean;
};
