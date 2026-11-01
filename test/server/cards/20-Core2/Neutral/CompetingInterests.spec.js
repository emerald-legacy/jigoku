describe('Competing Interests', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['kakita-yoshi', 'doji-whisperer'],
                    hand: ['competing-interests']
                },
                player2: {
                    inPlay: ['akodo-toturi', 'kakita-toshimoko']
                }
            });
            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.toturi = this.player2.findCardByName('akodo-toturi');
            this.toshimoko = this.player2.findCardByName('kakita-toshimoko');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.yoshi, this.whisperer],
                defenders: [this.toturi, this.toshimoko]
            });
            this.player2.pass();
        });

        it('chooses any participating unique character', function () {
            this.player1.clickCard('competing-interests');
            expect(this.player1).toBeAbleToSelect(this.yoshi);
            expect(this.player1).toBeAbleToSelect(this.toturi);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
        });

        it('bows the chosen character', function () {
            this.player1.clickCard('competing-interests');
            this.player1.clickCard(this.toturi);
            expect(this.toturi.bowed).toBe(true);
            expect(this.yoshi.bowed).toBe(false);
            expect(this.player1.findCardByName('competing-interests').location).toBe('conflict discard pile');
        });
    });
});

describe('Competing Interests with one unique card on the enemy side', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['kakita-yoshi', 'doji-whisperer'],
                    hand: ['competing-interests']
                },
                player2: {
                    inPlay: ['akodo-toturi', 'matsu-berserker']
                }
            });
            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.interests = this.player1.findCardByName('competing-interests');
            this.toturi = this.player2.findCardByName('akodo-toturi');
            this.berserker = this.player2.findCardByName('matsu-berserker');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.yoshi, this.whisperer],
                defenders: [this.toturi, this.berserker]
            });
            this.player2.pass();
        });

        it('cannot be played', function () {
            this.player1.clickCard(this.interests);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.interests.location).toBe('hand');
            expect(this.toturi.bowed).toBe(false);
        });
    });
});

describe('Competing Interests with a unique attachment on the enemy side', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 5,
                    inPlay: ['kakita-yoshi', 'doji-whisperer'],
                    hand: ['competing-interests', 'sato']
                },
                player2: {
                    inPlay: ['akodo-toturi', 'matsu-berserker']
                }
            });
            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.interests = this.player1.findCardByName('competing-interests');
            this.sato = this.player1.findCardByName('sato');
            this.toturi = this.player2.findCardByName('akodo-toturi');
            this.berserker = this.player2.findCardByName('matsu-berserker');
            this.player1.playAttachment(this.sato, this.berserker);
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.yoshi, this.whisperer],
                defenders: [this.toturi, this.berserker]
            });
            this.player2.pass();
        });

        it('counts your own unique attachment on an enemy character', function () {
            expect(this.berserker.attachments).toContain(this.sato);
            this.player1.clickCard(this.interests);
            expect(this.player1).toBeAbleToSelect(this.toturi);
            this.player1.clickCard(this.toturi);
            expect(this.toturi.bowed).toBe(true);
        });
    });
});
