describe('Sawakiten\'s Blessing', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-challenger', 'doji-whisperer'],
                    hand: ['sawakiten-s-blessing']
                },
                player2: {
                    inPlay: ['brash-samurai']
                }
            });
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.challenger],
                defenders: ['brash-samurai']
            });
            this.player2.pass();
        });

        it('chooses only a participating character you control', function () {
            this.player1.clickCard('sawakiten-s-blessing');
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
        });
    });
});

describe('Sawakiten\'s Blessing effects', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-challenger', 'doji-whisperer'],
                    hand: ['sawakiten-s-blessing', 'sawakiten-s-blessing']
                },
                player2: {
                    inPlay: ['brash-samurai', 'solemn-scholar'],
                    rings: ['earth']
                }
            });
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            [this.blessing, this.blessing2] = this.player1.filterCardsByName('sawakiten-s-blessing');
            this.brash = this.player2.findCardByName('brash-samurai');
            this.scholar = this.player2.findCardByName('solemn-scholar');
        });

        describe('in a military conflict', function () {
            beforeEach(function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.challenger, this.whisperer],
                    defenders: [this.brash]
                });
                this.player2.pass();
                this.player1.clickCard(this.blessing);
                this.player1.clickCard(this.challenger);
            });

            it('stops opponents\' card effects from bowing the character', function () {
                this.player2.clickCard(this.scholar);
                expect(this.player2).toBeAbleToSelect(this.whisperer);
                expect(this.player2).not.toBeAbleToSelect(this.challenger);
            });

            it('stops the character bowing as a result of the conflict\'s resolution', function () {
                this.noMoreActions();
                expect(this.getChatLogs(10)).toContain('player1 won a military conflict 3 vs 2');
                this.player1.clickPrompt('Don\'t resolve');
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.challenger.bowed).toBe(false);
                expect(this.whisperer.bowed).toBe(true);
                expect(this.brash.bowed).toBe(true);
            });

            it('can only be played once per round', function () {
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.blessing2);
                expect(this.blessing2.location).toBe('hand');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });

        it('cannot be played in a political conflict', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.challenger, this.whisperer],
                defenders: [this.brash]
            });
            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.blessing);
            expect(this.blessing.location).toBe('hand');
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });
    });
});
