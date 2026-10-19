describe('Shattered Blade Pass', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['aggressive-moto', 'giver-of-gifts']
                },
                player2: {
                    inPlay: ['togashi-initiate', 'togashi-yokuni'],
                    provinces: ['shattered-blade-pass']
                }
            });

            this.aggressiveMoto = this.player1.findCardByName('aggressive-moto');
            this.giverOfGifts = this.player1.findCardByName('giver-of-gifts');

            this.initiate = this.player2.findCardByName('togashi-initiate');
            this.yokuni = this.player2.findCardByName('togashi-yokuni');

            this.shatteredBladePass = this.player2.findCardByName('shattered-blade-pass', 'province 1');
        });

        it('if no defenders, readies & moves a character you control to the conflict and give you another action', function () {
            this.yokuni.bow();

            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.aggressiveMoto],
                defenders: [],
                province: this.shatteredBladePass
            });

            expect(this.yokuni.bowed).toBe(true);
            expect(this.game.currentConflict.defenders).not.toContain(this.yokuni);

            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.shatteredBladePass);
            expect(this.player2).not.toBeAbleToSelect(this.aggressiveMoto);
            expect(this.player2).toBeAbleToSelect(this.initiate);
            expect(this.player2).toBeAbleToSelect(this.yokuni);
            expect(this.player2).not.toBeAbleToSelect(this.giverOfGifts);

            this.player2.clickCard(this.yokuni);
            expect(this.yokuni.bowed).toBe(false);
            expect(this.game.currentConflict.defenders).toContain(this.yokuni);
            expect(this.getChatLogs(3)).toContain(
                'player2 uses Shattered Blade Pass to ready Togashi Yokuni and move it into the conflict, taking an additional action'
            );
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });

        it('if defenders, should not trigger', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.aggressiveMoto, this.giverOfGifts],
                defenders: [this.initiate],
                province: this.shatteredBladePass
            });

            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.shatteredBladePass);
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });
    });
});

describe('Shattered Blade Pass with Contested Countryside', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['aggressive-moto', 'giver-of-gifts'],
                    dynastyDiscard: ['contested-countryside'],
                    role: 'keeper-of-void'
                },
                player2: {
                    inPlay: ['togashi-initiate'],
                    provinces: ['shattered-blade-pass']
                }
            });
            this.aggressiveMoto = this.player1.findCardByName('aggressive-moto');
            this.giverOfGifts = this.player1.findCardByName('giver-of-gifts');
            this.countryside = this.player1.findCardByName('contested-countryside');
            this.player1.moveCard(this.countryside, 'province 1');
            this.countryside.facedown = false;
            this.shatteredBladePass = this.player2.findCardByName('shattered-blade-pass', 'province 1');
            this.game.checkGameState(true);
        });

        it('cannot be used by the attacker, who controls participating characters, even without defenders', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.giverOfGifts],
                defenders: [],
                province: this.shatteredBladePass
            });

            this.player2.pass();
            this.player1.clickCard(this.shatteredBladePass);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.game.currentConflict.attackers).not.toContain(this.aggressiveMoto);
        });
    });
});
