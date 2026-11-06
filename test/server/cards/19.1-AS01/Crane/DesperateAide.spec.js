describe('Desperate Aide', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-diplomat', 'brash-samurai', 'isawa-tadaka']
                },
                player2: {
                    inPlay: ['kakita-yoshi', 'desperate-aide']
                }
            });

            this.brash = this.player1.findCardByName('brash-samurai');
            this.diplomat = this.player1.findCardByName('doji-diplomat');
            this.tadaka = this.player1.findCardByName('isawa-tadaka');

            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.aide = this.player2.findCardByName('desperate-aide');

            this.player1.player.showBid = 5;
            this.player2.player.showBid = 5;
        });

        it('should do nothing without composure', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.diplomat, this.brash, this.tadaka],
                defenders: [this.aide]
            });

            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.aide);
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });

        it('should draw with composure but not gain honor if not winning conflict', function () {
            this.player2.player.showBid = 1;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.diplomat, this.brash, this.tadaka],
                defenders: [this.aide]
            });

            const hand = this.player2.hand.length;
            const honor = this.player2.honor;
            this.player2.clickCard(this.aide);
            expect(this.player2.hand.length).toBe(hand + 1);
            expect(this.player2.honor).toBe(honor);
            expect(this.getChatLogs(5)).toContain('player2 uses Desperate Aide to draw 1 card');
        });

        it('should gain honor if winning', function () {
            this.player2.player.showBid = 1;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.diplomat, this.brash, this.tadaka],
                defenders: [this.yoshi, this.aide],
                type: 'political'
            });

            const hand = this.player2.hand.length;
            const honor = this.player2.honor;
            this.player2.clickCard(this.aide);
            expect(this.player2.hand.length).toBe(hand + 1);
            expect(this.player2.honor).toBe(honor + 1);
            expect(this.getChatLogs(5)).toContain('player2 uses Desperate Aide to draw 1 card and gain 1 honor');
        });

        it('does not count bowed characters, as the conflict does not', function () {
            this.player2.player.showBid = 1;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.diplomat, this.brash, this.tadaka],
                defenders: [this.yoshi, this.aide],
                type: 'political'
            });
            this.yoshi.bowed = true;
            this.game.checkGameState(true);

            const hand = this.player2.hand.length;
            const honor = this.player2.honor;
            this.player2.clickCard(this.aide);
            expect(this.player2.hand.length).toBe(hand + 1);
            expect(this.player2.honor).toBe(honor);
            expect(this.getChatLogs(5)).toContain('player2 uses Desperate Aide to draw 1 card');
        });

        it('gains honor when counting more POL during a MIL conflict ', function () {
            this.player2.player.showBid = 1;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.diplomat, this.brash, this.tadaka],
                defenders: [this.yoshi, this.aide],
                type: 'military'
            });

            const hand = this.player2.hand.length;
            const honor = this.player2.honor;
            this.player2.clickCard(this.aide);
            expect(this.player2.hand.length).toBe(hand + 1);
            expect(this.player2.honor).toBe(honor + 1);
            expect(this.getChatLogs(5)).toContain('player2 uses Desperate Aide to draw 1 card and gain 1 honor');
        });

        it('counts the Imperial Favor in a political conflict', function () {
            this.player2.player.showBid = 1;
            this.player2.player.imperialFavor = 'political';
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.diplomat, this.brash],
                defenders: [this.aide],
                type: 'political'
            });

            const honor = this.player2.honor;
            this.player2.clickCard(this.aide);
            expect(this.player2.honor).toBe(honor + 1);
        });
    });
});

describe('Desperate Aide in a military conflict', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['enigmatic-magistrate', 'brash-samurai', 'doji-diplomat']
                },
                player2: {
                    inPlay: ['desperate-aide', 'bayushi-manipulator']
                }
            });

            this.magistrate = this.player1.findCardByName('enigmatic-magistrate');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.diplomat = this.player1.findCardByName('doji-diplomat');

            this.aide = this.player2.findCardByName('desperate-aide');
            this.manipulator = this.player2.findCardByName('bayushi-manipulator');

            this.player1.player.showBid = 5;
            this.player2.player.showBid = 1;
        });

        it('does not count political skill of characters that cannot contribute', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.magistrate, this.brash, this.diplomat],
                defenders: [this.aide, this.manipulator],
                type: 'military'
            });

            const honor = this.player2.honor;
            this.player2.clickCard(this.aide);
            expect(this.player2.honor).toBe(honor + 1);
            expect(this.getChatLogs(5)).toContain('player2 uses Desperate Aide to draw 1 card and gain 1 honor');
        });
    });
});
