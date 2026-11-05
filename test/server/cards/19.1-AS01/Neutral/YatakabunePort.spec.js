describe('Yatakabune Port', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['isawa-tadaka'],
                    hand: ['a-new-name']
                },
                player2: {
                    provinces: ['yatakabune-port']
                }
            });

            this.isawaTadaka = this.player1.findCardByName('isawa-tadaka');
            this.ann = this.player1.findCardByName('a-new-name');

            this.port = this.player2.findCardByName('yatakabune-port');
        });

        it('should claim favor when broken', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.isawaTadaka],
                defenders: [],
                province: this.port,
                type: 'military'
            });

            this.noMoreActions();
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.port);

            this.player2.clickCard(this.port);
            this.player2.clickPrompt('military');
            expect(this.player2.player.imperialFavor).toBe('military');
            expect(this.getChatLogs(10)).toContain('player2 claims the Emperor\'s military favor!');
            expect(this.getChatLogs(10)).toContain('player2 uses Yatakabune Port to claim the Emperor\'s favor');
        });
    });
});

describe('Yatakabune Port broken outside a conflict', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'draw',
                player1: {
                    inPlay: ['doji-challenger']
                },
                player2: {
                    inPlay: ['doji-whisperer'],
                    hand: ['feeding-an-army'],
                    provinces: ['yatakabune-port']
                }
            });
            this.port = this.player2.findCardByName('yatakabune-port');
            this.feeding = this.player2.findCardByName('feeding-an-army');
            this.port.facedown = false;
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
            this.noMoreActions();
        });

        it('should not trigger', function () {
            expect(this.game.currentPhase).toBe('conflict');
            this.player2.clickCard(this.feeding);
            this.player2.clickCard(this.port);
            expect(this.port.isBroken).toBe(true);
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.player2.player.imperialFavor).toBe('');
        });
    });
});
