describe('Steadfast Orator', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['steadfast-orator', 'doji-whisperer'],
                    hand: ['fine-katana']
                },
                player2: {
                    inPlay: ['togashi-yokuni'],
                    hand: ['rout']
                }
            });

            this.orator = this.player1.findCardByName('steadfast-orator');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.katana = this.player1.findCardByName('fine-katana');
            this.yokuni = this.player2.findCardByName('togashi-yokuni');
            this.rout = this.player2.findCardByName('rout');

            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.orator, this.whisperer],
                defenders: [this.yokuni]
            });
        });

        function rout() {
            this.player2.clickCard(this.rout);
            this.player2.clickCard(this.whisperer);
        }

        it('discards a card or the Imperial Favor to move the character back', function () {
            this.player1.player.imperialFavor = 'military';
            rout.call(this);
            expect(this.whisperer.isParticipating()).toBe(false);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.orator);

            this.player1.clickCard(this.orator);
            expect(this.player1).toHavePromptButton('Discard a card from your hand');
            expect(this.player1).toHavePromptButton('Discard the Imperial Favor');

            this.player1.clickPrompt('Discard a card from your hand');
            this.player1.clickCard(this.katana);
            expect(this.katana.location).toBe('conflict discard pile');
            expect(this.player1.player.imperialFavor).toBe('military');
            expect(this.whisperer.isParticipating()).toBe(true);
        });

        it('discards the Imperial Favor', function () {
            this.player1.player.imperialFavor = 'military';
            rout.call(this);
            this.player1.clickCard(this.orator);
            this.player1.clickPrompt('Discard the Imperial Favor');
            expect(this.player1.player.imperialFavor).toBe('');
            expect(this.katana.location).toBe('hand');
            expect(this.getChatLogs(3)).toContain('player1 uses Steadfast Orator, discarding the Imperial Favor to move Doji Whisperer into the conflict');
            expect(this.whisperer.isParticipating()).toBe(true);
        });

        it('asks for no choice when only one cost can be paid', function () {
            rout.call(this);
            this.player1.clickCard(this.orator);
            expect(this.player1).toHavePrompt('Select card to discard');
            this.player1.clickCard(this.katana);
            expect(this.whisperer.isParticipating()).toBe(true);
            expect(this.getChatLogs(3)).toContain('player1 uses Steadfast Orator, discarding Fine Katana to move Doji Whisperer into the conflict');
        });
    });
});

describe('Steadfast Orator and costs', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['steadfast-orator', 'shinjo-archer'],
                    hand: ['fine-katana']
                },
                player2: {
                    inPlay: ['togashi-yokuni']
                }
            });
            this.orator = this.player1.findCardByName('steadfast-orator');
            this.archer = this.player1.findCardByName('shinjo-archer');
            this.yokuni = this.player2.findCardByName('togashi-yokuni');
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.orator, this.archer],
                defenders: [this.yokuni]
            });
            this.player2.pass();
        });

        it('doesn\'t react to a character moved home by a cost (only card effects)', function () {
            this.player1.clickCard(this.archer);
            this.player1.clickCard(this.yokuni);
            expect(this.archer.isParticipating()).toBe(false);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });
    });
});
