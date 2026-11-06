describe('Caverns of Stolen Hope', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['aggressive-moto', 'worldly-shiotome', 'utaku-tetsuko'],
                    hand: ['i-can-swim', 'way-of-the-scorpion']
                },
                player2: {
                    provinces: ['caverns-of-stolen-hope']
                }
            });

            this.aggressiveMoto = this.player1.findCardByName('aggressive-moto');
            this.wordlyShiotome = this.player1.findCardByName('worldly-shiotome');
            this.tetsuko = this.player1.findCardByName('utaku-tetsuko');

            this.caverns = this.player2.findCardByName('caverns-of-stolen-hope', 'province 1');
        });

        it('discards random cards from attacker hand', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.aggressiveMoto, this.wordlyShiotome],
                province: this.caverns
            });

            expect(this.player2).toHavePrompt('Any reactions?');

            this.player2.clickCard(this.caverns);
            expect(this.getChatLogs(3)).toContain(
                'player2 uses Caverns of Stolen Hope to make player1 discard 2 cards at random'
            );
        });
    });
});

describe('Caverns of Stolen Hope revealed while its player attacks', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['aggressive-moto'],
                    hand: ['i-can-swim', 'way-of-the-scorpion'],
                    provinces: ['caverns-of-stolen-hope']
                },
                player2: {
                    provinces: ['border-fortress'],
                    hand: ['fine-katana', 'let-go']
                }
            });
            this.moto = this.player1.findCardByName('aggressive-moto');
            this.caverns = this.player1.findCardByName('caverns-of-stolen-hope', 'province 1');
            this.fortress = this.player2.findCardByName('border-fortress', 'province 1');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.moto],
                defenders: [],
                province: this.fortress
            });
        });

        it('makes the attacking player discard', function () {
            const p1Hand = this.player1.hand.length;
            const p2Hand = this.player2.hand.length;
            this.player2.clickCard(this.fortress);
            this.player2.clickCard(this.caverns);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.caverns);
            expect(this.player1.hand.length).toBe(p1Hand - 1);
            expect(this.player2.hand.length).toBe(p2Hand);
        });
    });
});
