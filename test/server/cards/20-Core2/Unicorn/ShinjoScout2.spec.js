describe('Shinjo Scout 2', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['shinjo-scout-2'],
                    hand: []
                },
                player2: {
                    provinces: ['midnight-revels']
                }
            });

            this.shinjoScout = this.player1.findCardByName('shinjo-scout-2');

            this.revels = this.player2.findCardByName('midnight-revels', 'province 1');
        });

        it('blocks province triggers when revealing a province', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.shinjoScout],
                type: 'military',
                province: this.revels
            });
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.shinjoScout);

            this.player1.clickCard(this.shinjoScout);
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.getChatLogs(5)).toContain(
                'player1 uses Shinjo Scout to avoid the dangers of their exploration'
            );
            expect(this.getChatLogs(5)).toContain(
                'player1 prevents Midnight Revels from triggering its abilities during this conflict'
            );
        });

        it('does not block province triggers when revealing a province', function () {
            this.revels.facedown = false;

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.shinjoScout],
                type: 'military',
                province: this.revels
            });
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).not.toBeAbleToSelect(this.shinjoScout);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.revels);
        });

    });
});

describe('Shinjo Scout 2 when a province that isn\'t attacked is revealed', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['shinjo-scout-2']
                },
                player2: {
                    provinces: ['border-fortress', 'public-forum']
                }
            });
            this.shinjoScout = this.player1.findCardByName('shinjo-scout-2');
            this.fortress = this.player2.findCardByName('border-fortress', 'province 1');
            this.forum = this.player2.findCardByName('public-forum', 'province 2');
            this.fortress.facedown = false;
        });

        it('does not trigger', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.shinjoScout],
                type: 'military',
                province: this.fortress,
                defenders: []
            });
            this.player2.clickCard(this.fortress);
            this.player2.clickCard(this.forum);
            expect(this.forum.facedown).toBe(false);
            expect(this.player1).not.toBeAbleToSelect(this.shinjoScout);
        });
    });
});

describe('Shinjo Scout 2 with Contested Countryside', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['shinjo-scout-2'],
                    dynastyDiscard: ['contested-countryside']
                },
                player2: {
                    inPlay: ['doji-whisperer'],
                    provinces: ['floating-world']
                }
            });

            this.shinjoScout = this.player1.findCardByName('shinjo-scout-2');
            this.countryside = this.player1.placeCardInProvince('contested-countryside', 'province 1');
            this.countryside.facedown = false;
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.floatingWorld = this.player2.findCardByName('floating-world', 'province 1');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.shinjoScout],
                type: 'military',
                province: this.floatingWorld
            });
            this.player1.clickCard(this.shinjoScout);
            this.player2.clickCard(this.whisperer);
            this.player2.clickPrompt('Done');
        });

        it('only stops the opponent from triggering the attacked province', function () {
            this.player2.clickCard(this.floatingWorld);
            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.pass();
            this.player1.clickCard(this.floatingWorld);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            this.player1.clickCard(this.whisperer);
            expect(this.whisperer.isDishonored).toBe(true);
        });
    });
});

describe('Shinjo Scout 2 and a Forced ability on the attacked province', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['shinjo-scout-2']
                },
                player2: {
                    provinces: ['temple-of-jikoju']
                }
            });
            this.shinjoScout = this.player1.findCardByName('shinjo-scout-2');
            this.temple = this.player2.findCardByName('temple-of-jikoju', 'province 1');
        });

        // rulings #778, #810, #942: Forced abilities are triggered by the game, not a player
        it('does not stop the province\'s Forced Reaction', function () {
            const fate = this.game.rings.air.fate;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.shinjoScout],
                type: 'military',
                province: this.temple,
                ring: 'earth'
            });
            this.player1.clickCard(this.shinjoScout);
            expect(this.getChatLogs(5)).toContain('player1 prevents Temple of Jikoju from triggering its abilities during this conflict');
            this.player2.clickPrompt('Done');
            expect(this.getChatLogs(5)).toContain('player2 uses Temple of Jikoju to place 1 fate on Air Ring');
            expect(this.game.rings.air.fate).toBe(fate + 1);
        });
    });
});
