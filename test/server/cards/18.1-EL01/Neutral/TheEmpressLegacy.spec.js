describe('The Empress\'s Legacy', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['hida-guardian', 'kakita-yoshi'],
                    hand: ['the-empress-legacy', 'severed-from-the-stream']
                }
            });
            this.legacy = this.player1.findCardByName('the-empress-legacy');
            this.guardian = this.player1.findCardByName('hida-guardian');
            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.stream = this.player1.findCardByName('severed-from-the-stream');
        });

        it('should contribute glory while bowed', function() {
            this.guardian.bowed = true;
            this.yoshi.bowed = true;

            this.player1.clickCard(this.legacy);
            this.player1.clickCard(this.yoshi);

            this.player2.pass();
            this.player1.clickCard(this.stream);
            expect(this.getChatLogs(5)).toContain('player1 wins the glory count 3 vs 0');
        });

        it('should give an extra glory if its on a crab character', function() {
            this.guardian.bowed = true;
            this.yoshi.bowed = true;

            this.player1.clickCard(this.legacy);
            this.player1.clickCard(this.guardian);

            this.player2.pass();
            this.player1.clickCard(this.stream);
            expect(this.getChatLogs(5)).toContain('player1 wins the glory count 2 vs 0');
        });
    });
});

describe('The Empress\'s Legacy on an opponent\'s character', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['kakita-yoshi'],
                    hand: ['the-empress-legacy']
                },
                player2: {
                    inPlay: ['hida-guardian']
                }
            });
            this.legacy = this.player1.findCardByName('the-empress-legacy');
            this.guardian = this.player2.findCardByName('hida-guardian');
        });

        it('gives the extra glory to the character\'s controller', function() {
            this.player1.clickCard(this.legacy);
            this.player1.clickCard(this.guardian);
            expect(this.guardian.attachments).toContain(this.legacy);
            expect(this.player2.player.gloryModifier).toBe(1);
            expect(this.player1.player.gloryModifier).toBe(0);
        });
    });
});
