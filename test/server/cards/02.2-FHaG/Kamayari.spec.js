describe('Kamayari', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['ide-ryoma', 'doji-whisperer']
                },
                player2: {
                    inPlay: [{ card: 'matsu-berserker', attachments: ['kamayari'] }]
                }
            });
            this.ryoma = this.player1.findCardByName('ide-ryoma');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.berserker = this.player2.findCardByName('matsu-berserker');
            this.kamayari = this.player2.findCardByName('kamayari');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.ryoma, this.whisperer],
                defenders: [this.berserker]
            });
            this.player2.pass();
        });

        it('bows a character that triggers an ability', function() {
            this.player1.clickCard(this.ryoma);
            this.player1.clickCard(this.ryoma);
            this.player1.clickCard(this.whisperer);
            this.player1.clickCard(this.whisperer);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            this.player2.clickCard(this.kamayari);
            expect(this.ryoma.bowed).toBe(true);
        });

        it('is offered once per ability, not again when a step of it starts', function() {
            this.player1.clickCard(this.ryoma);
            this.player1.clickCard(this.ryoma);
            this.player1.clickCard(this.whisperer);
            this.player1.clickCard(this.whisperer);
            expect(this.whisperer.bowed).toBe(true);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.kamayari);
            this.player2.clickPrompt('Pass');
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
        });
    });
});

describe('Kamayari and keyword abilities', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['shinjo-shono']
                },
                player2: {
                    inPlay: [{ card: 'matsu-berserker', attachments: ['kamayari'] }]
                }
            });
            this.shono = this.player1.findCardByName('shinjo-shono');
            this.berserker = this.player2.findCardByName('matsu-berserker');
            this.kamayari = this.player2.findCardByName('kamayari');
        });

        it('does not react to Pride (a keyword is not a triggered ability)', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.shono],
                defenders: [this.berserker]
            });
            this.noMoreActions();
            expect(this.getChatLogs(10)).toContain('Shinjo Shono is dishonored due to their Pride');
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
        });
    });
});

describe('Kamayari and resolved abilities', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-kuwanan', 'matsu-berserker'],
                    hand: ['kamayari']
                },
                player2: {
                    inPlay: ['beloved-advisor'],
                    hand: ['battlefield-orders']
                }
            });
            this.kuwanan = this.player1.findCardByName('doji-kuwanan');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.advisor = this.player2.findCardByName('beloved-advisor');
            this.orders = this.player2.findCardByName('battlefield-orders');
            this.kamayari = this.player1.playAttachment('kamayari', this.berserker);
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.berserker],
                defenders: [this.advisor]
            });
        });

        it('does not react to an ability resolved by Battlefield Orders', function() {
            this.player2.clickCard(this.orders);
            this.player2.clickCard(this.advisor);
            expect(this.player1).not.toBeAbleToSelect(this.kamayari);
            expect(this.advisor.bowed).toBe(false);
        });
    });
});
