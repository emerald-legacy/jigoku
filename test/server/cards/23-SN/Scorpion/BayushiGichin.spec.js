describe('Bayushi Gichin', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['bayushi-gichin', 'heir-of-the-serpent', 'ikoma-ujio'],
                    hand: ['fiery-madness'],
                    conflictDiscard: ['stolen-breath']
                },
                player2: {
                    inPlay: ['doji-challenger', 'akodo-toturi', 'kitsuki-yaruma']
                }
            });

            this.serpent = this.player1.findCardByName('heir-of-the-serpent');
            this.ujio = this.player1.findCardByName('ikoma-ujio');
            this.gichin = this.player1.findCardByName('bayushi-gichin');
            this.madness = this.player1.findCardByName('fiery-madness');
            this.breath = this.player1.findCardByName('stolen-breath');

            this.challenger = this.player2.findCardByName('doji-challenger');
            this.toturi = this.player2.findCardByName('akodo-toturi');
            this.yaruma = this.player2.findCardByName('kitsuki-yaruma');
        });

        it('cannot duel strike in a duel it is not involved in', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.ujio, this.gichin],
                defenders: [this.challenger]
            });

            this.player2.pass();
            this.player1.clickCard(this.ujio);
            this.player1.clickCard(this.challenger);

            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');

            expect(this.player1).not.toBeAbleToSelect(this.gichin);
            expect(this.madness.parent).toBeFalsy();
        });

        it('duel win', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.gichin],
                defenders: [this.challenger, this.toturi]
            });

            const honor = this.player1.honor;
            const honor2 = this.player2.honor;

            this.player2.pass();
            this.player1.clickCard(this.gichin);
            this.player1.clickCard(this.challenger);

            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.gichin);

            this.player1.clickCard(this.gichin);
            expect(this.player1).toBeAbleToSelect(this.challenger);

            this.player1.clickCard(this.challenger);

            expect(this.player1).toBeAbleToSelect(this.madness);
            expect(this.player1).toBeAbleToSelect(this.breath);

            this.player1.clickCard(this.madness);
            expect(this.madness.parent).toBe(this.challenger);

            expect(this.getChatLogs(5)).toContain('player1 poisons Doji Challenger');
            expect(this.getChatLogs(5)).toContain('player1 attaches Fiery Madness');

            expect(this.player1.honor).toBe(honor + 1);
            expect(this.player2.honor).toBe(honor2 - 1);

            expect(this.getChatLogs(5)).toContain('Duel Effect: take 1 honor from player2');
        });

        it('duel win, no eligible poisons', function () {
            this.player1.moveCard(this.madness, 'removed from game');
            this.player1.moveCard(this.breath, 'removed from game');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.gichin],
                defenders: [this.challenger, this.toturi]
            });

            const honor = this.player1.honor;
            const honor2 = this.player2.honor;

            this.player2.pass();
            this.player1.clickCard(this.gichin);
            this.player1.clickCard(this.challenger);

            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');

            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1.honor).toBe(honor + 1);
            expect(this.player2.honor).toBe(honor2 - 1);

            expect(this.getChatLogs(5)).toContain('Duel Effect: take 1 honor from player2');
        });

        it('duel loss', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.gichin],
                defenders: [this.challenger, this.toturi]
            });

            const honor = this.player1.honor;
            const honor2 = this.player2.honor;

            this.player2.pass();
            this.player1.clickCard(this.gichin);
            this.player1.clickCard(this.toturi);

            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');

            this.player1.clickCard(this.gichin);
            this.player1.clickCard(this.toturi);
            this.player1.clickCard(this.madness);
            expect(this.madness.parent).toBe(this.toturi);

            expect(this.player1.honor).toBe(honor);
            expect(this.player2.honor).toBe(honor2);

            expect(this.getChatLogs(5)).toContain('The duel has no effect');
        });

        it('no eligible poisons for opponent', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.gichin],
                defenders: [this.challenger, this.yaruma]
            });

            const honor = this.player1.honor;
            const honor2 = this.player2.honor;

            this.player2.pass();
            this.player1.clickCard(this.gichin);
            this.player1.clickCard(this.yaruma);

            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');

            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1.honor).toBe(honor + 1);
            expect(this.player2.honor).toBe(honor2 - 1);

            expect(this.getChatLogs(5)).toContain('Duel Effect: take 1 honor from player2');
        });

        it('testing disguise', function () {
            this.player1.moveCard(this.gichin, 'province 1');
            this.gichin.facedown = false;
            this.game.checkGameState(true);

            this.player1.clickCard(this.gichin);
            expect(this.player1).toBeAbleToSelect(this.serpent);
            this.player1.clickCard(this.serpent);

            expect(this.getChatLogs(5)).toContain('player1 plays Bayushi Gichin using Disguised, choosing to replace Heir of the Serpent');
        });
    });
});

describe('Bayushi Gichin and a duel without a loser', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 15,
                    inPlay: ['bayushi-gichin']
                },
                player2: {
                    honor: 5,
                    inPlay: ['hida-yakamo']
                }
            });
            this.gichin = this.player1.findCardByName('bayushi-gichin');
            this.yakamo = this.player2.findCardByName('hida-yakamo');
        });

        it('takes 1 honor from the opponent when winning against Hida Yakamo', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.gichin],
                defenders: [this.yakamo]
            });
            this.player2.pass();
            this.player1.clickCard(this.gichin);
            this.player1.clickCard(this.yakamo);
            this.player1.clickPrompt('3');
            this.player2.clickPrompt('1');
            expect(this.getChatLogs(5)).toContain('Bayushi Gichin: 8 vs 5: Hida Yakamo');
            expect(this.getChatLogs(5)).toContain('Duel Effect: take 1 honor from player2');
            expect(this.player1.honor).toBe(14);
            expect(this.player2.honor).toBe(6);
        });
    });
});
