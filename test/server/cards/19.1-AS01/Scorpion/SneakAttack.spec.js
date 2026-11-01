describe('Sneak Attack', function () {
    integration(function () {
        describe('With a normal stronghold', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-manipulator', 'shosuro-sadako'],
                        hand: ['sneak-attack']
                    },
                    player2: {
                        inPlay: ['wandering-ronin'],
                        hand: ['for-shame', 'let-go']
                    }
                });

                this.manipulator = this.player1.findCardByName('bayushi-manipulator');
                this.sadako = this.player1.findCardByName('shosuro-sadako');
                this.sneakAttack = this.player1.findCardByName('sneak-attack');

                this.wanderingRonin = this.player2.findCardByName('wandering-ronin');
                this.forShame = this.player2.findCardByName('for-shame');
                this.letGo = this.player2.findCardByName('let-go');
            });

            it('should give the attacking player the first action opportunity and set aside opponent cards', function () {
                const player1StartingHonor = this.player1.honor;
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.manipulator]
                });

                expect(this.player1).toHavePrompt('Waiting for opponent to choose defenders');
                expect(this.player2).toHavePrompt('Choose defenders');

                this.player2.clickPrompt('Done');

                this.player1.clickCard(this.sneakAttack);
                expect(this.player1.honor).toBe(player1StartingHonor - 1);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.player2).toHavePrompt('Waiting for opponent to take an action or pass');

                expect(this.getChatLogs(5)).toContain(
                    'player1 plays Sneak Attack, losing 1 honor to give player1 the first action in this conflict and set aside opponent\'s cards'
                );
                const logs = this.getChatLogs(5);
                const setAsideLogs = logs.filter(l => l.startsWith('player2 sets aside'));
                expect(setAsideLogs.length).toBe(1);
                expect(setAsideLogs[0]).toMatch(/player2 sets aside (For Shame! and Let Go|Let Go and For Shame!)/);

                // Verify cards are removed from game
                expect(this.forShame.location).toBe('removed from game');
                expect(this.letGo.location).toBe('removed from game');
            });
        });

        describe('With more than two cards in the opponent\'s hand', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-manipulator'],
                        hand: ['sneak-attack']
                    },
                    player2: {
                        inPlay: ['wandering-ronin'],
                        hand: ['for-shame', 'let-go', 'banzai', 'fine-katana', 'ornate-fan', 'assassination']
                    }
                });

                this.manipulator = this.player1.findCardByName('bayushi-manipulator');
                this.sneakAttack = this.player1.findCardByName('sneak-attack');
            });

            it('should set aside the two cards it names and return them when the conflict ends', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.manipulator]
                });
                this.player2.clickPrompt('Done');
                this.player1.clickCard(this.sneakAttack);

                const setAsideLog = this.getChatLogs(5).find(l => l.startsWith('player2 sets aside '));
                const named = setAsideLog.replace('player2 sets aside ', '').split(' and ').sort();
                expect(named.length).toBe(2);
                expect(this.player2.player.removedFromGame.map(card => card.name).sort()).toEqual(named);
                expect(this.player2.hand.length).toBe(4);

                this.player1.pass();
                this.player2.pass();
                this.player1.clickPrompt('Don\'t resolve');
                expect(this.game.currentConflict).toBeFalsy();
                expect(this.player2.player.removedFromGame.length).toBe(0);
                expect(this.player2.hand.length).toBe(6);
                expect(this.getChatLogs(10)).toContain('player2 picks back their cards');
            });
        });

        describe('With Seven Stings Keep', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        stronghold: ['seven-stings-keep'],
                        inPlay: ['bayushi-manipulator', 'shosuro-sadako'],
                        hand: ['sneak-attack']
                    },
                    player2: {
                        inPlay: ['wandering-ronin']
                    }
                });

                this.keep = this.player1.findCardByName('seven-stings-keep');
                this.manipulator = this.player1.findCardByName('bayushi-manipulator');
                this.sadako = this.player1.findCardByName('shosuro-sadako');
                this.sneakAttack = this.player1.findCardByName('sneak-attack');

                this.wanderingRonin = this.player2.findCardByName('wandering-ronin');
                this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 1');
            });

            it('should give the attacking player the first action opportunity', function () {
                const player1StartingHonor = this.player1.honor;
                this.noMoreActions();

                this.player1.clickCard(this.keep);
                this.player1.clickPrompt('1');
                expect(this.player1).toHavePrompt('Waiting for opponent to choose defenders');
                expect(this.player2).toHavePrompt('Choose defenders');

                this.player2.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Initiate Conflict');
                expect(this.player1).not.toBeAbleToSelect(this.sneakAttack);

                this.player1.clickCard(this.manipulator);
                this.player1.clickRing('air');
                this.player1.clickCard(this.shamefulDisplay);
                this.player1.clickPrompt('Initiate Conflict');
                expect(this.player1).toBeAbleToSelect(this.sneakAttack);

                this.player1.clickCard(this.sneakAttack);
                expect(this.player1.honor).toBe(player1StartingHonor - 1);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.player2).toHavePrompt('Waiting for opponent to take an action or pass');
                expect(this.getChatLogs(5)).toContain(
                    'player1 plays Sneak Attack, losing 1 honor to give player1 the first action in this conflict'
                );
            });
        });
    });
});
