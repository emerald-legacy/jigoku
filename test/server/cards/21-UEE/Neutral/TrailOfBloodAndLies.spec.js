describe('Trail of Blood and Lies', function () {
    integration(function () {
        function setup(inPlay, opponentInPlay = ['doji-challenger', 'kakita-yoshi']) {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay,
                    hand: ['mono-no-aware', 'trail-of-blood-and-lies']
                },
                player2: {
                    inPlay: opponentInPlay
                }
            });

            this.monoNoAware = this.player1.findCardByName('mono-no-aware');
            this.trail = this.player1.findCardByName('trail-of-blood-and-lies');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');

            this.challenger.fate = 1;
        }

        it('makes the opponent dishonor a character', function () {
            setup.call(this, ['doji-whisperer']);
            this.player1.clickCard(this.monoNoAware);
            expect(this.player1).toHavePrompt('Triggered Abilities');

            this.player1.clickCard(this.trail);
            expect(this.player2).toBeAbleToSelect(this.challenger);
            expect(this.player2).toBeAbleToSelect(this.yoshi);

            this.player2.clickCard(this.challenger);
            expect(this.challenger.isDishonored).toBe(true);
            expect(this.yoshi.isDishonored).toBe(false);
            expect(this.player2).toHavePrompt('Action Window');
        });

        it('may resolve twice while you control a Magistrate', function () {
            setup.call(this, ['doji-whisperer', 'cunning-magistrate']);
            this.player1.clickCard(this.monoNoAware);
            this.player1.clickCard(this.trail);
            this.player2.clickCard(this.challenger);

            expect(this.player1).toHavePrompt('Resolve this ability again?');
            this.player1.clickPrompt('Yes');
            expect(this.player2).not.toBeAbleToSelect(this.challenger);
            expect(this.player2).toBeAbleToSelect(this.yoshi);

            this.player2.clickCard(this.yoshi);
            expect(this.challenger.isDishonored).toBe(true);
            expect(this.yoshi.isDishonored).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 chooses to resolve Trail of Blood and Lies again');
            expect(this.player2).toHavePrompt('Action Window');
        });

        it('may resolve twice although its fate cost can\'t be paid again', function () {
            setup.call(this, ['doji-whisperer', 'cunning-magistrate']);
            this.player1.fate = 4;
            this.player1.clickCard(this.monoNoAware);
            this.player1.clickCard(this.trail);
            expect(this.player1.fate).toBe(0);
            this.player2.clickCard(this.challenger);

            expect(this.player1).toHavePrompt('Resolve this ability again?');
            this.player1.clickPrompt('Yes');
            this.player2.clickCard(this.yoshi);
            expect(this.yoshi.isDishonored).toBe(true);
        });

        it('resolves once when you decline', function () {
            setup.call(this, ['doji-whisperer', 'cunning-magistrate']);
            this.player1.clickCard(this.monoNoAware);
            this.player1.clickCard(this.trail);
            this.player2.clickCard(this.challenger);

            this.player1.clickPrompt('No');
            expect(this.yoshi.isDishonored).toBe(false);
            expect(this.getChatLogs(5)).toContain('player1 chooses not to resolve Trail of Blood and Lies again');
            expect(this.player2).toHavePrompt('Action Window');
        });

        it('may resolve twice when the dishonor was redirected', function () {
            setup.call(this, ['doji-whisperer', 'cunning-magistrate'], ['doji-challenger', 'kakita-yoshi', 'kitsuki-shomon']);
            this.shomon = this.player2.findCardByName('kitsuki-shomon');
            this.player1.clickCard(this.monoNoAware);
            this.player1.clickCard(this.trail);
            this.player2.clickCard(this.challenger);
            this.player2.clickCard(this.shomon);
            expect(this.shomon.isDishonored).toBe(true);
            expect(this.challenger.isDishonored).toBe(false);

            expect(this.player1).toHavePrompt('Resolve this ability again?');
            this.player1.clickPrompt('Yes');
            this.player2.clickCard(this.yoshi);
            expect(this.yoshi.isDishonored).toBe(true);
        });
    });
});

describe('Trail of Blood and Lies and a discarded character', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 10,
                    inPlay: ['doji-challenger'],
                    hand: ['assassination', 'trail-of-blood-and-lies']
                },
                player2: {
                    inPlay: [{ card: 'matsu-berserker', fate: 1 }, 'kakita-yoshi']
                }
            });
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.assassination = this.player1.findCardByName('assassination');
            this.trail = this.player1.findCardByName('trail-of-blood-and-lies');
            this.berserker = this.player2.findCardByName('matsu-berserker');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');
        });

        it('reacts when an opponent\'s character with fate is discarded', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.challenger],
                defenders: [this.yoshi]
            });
            this.player2.pass();
            this.player1.clickCard(this.assassination);
            this.player1.clickCard(this.berserker);
            expect(this.berserker.location).toBe('dynasty discard pile');

            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.trail);
            expect(this.player2).toBeAbleToSelect(this.yoshi);
            this.player2.clickCard(this.yoshi);
            expect(this.yoshi.isDishonored).toBe(true);
            expect(this.getChatLogs(4)).toContain('player1 plays Trail of Blood and Lies to dishonor Kakita Yoshi');
        });
    });
});

describe('Trail of Blood and Lies in the fate phase', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [{ card: 'doji-whisperer', fate: 1 }],
                    hand: ['trail-of-blood-and-lies']
                },
                player2: {
                    inPlay: [{ card: 'kakita-yoshi', fate: 2 }]
                }
            });
            this.trail = this.player1.findCardByName('trail-of-blood-and-lies');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');
        });

        it('does not react to fate removed in the fate phase', function() {
            this.flow.finishConflictPhase();

            expect(this.game.currentPhase).toBe('fate');
            expect(this.yoshi.fate).toBe(1);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).toHavePrompt('Select dynasty cards to discard');
            expect(this.trail.location).toBe('hand');
        });
    });
});
