describe('Cloud the Mind 2', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['moto-juro'],
                    hand: ['cloud-the-mind-2'],
                    dynastyDiscard: ['adept-of-the-waves']
                },
                player2: {
                    inPlay: ['matsu-berserker']
                }
            });

            this.adept = this.player1.findCardByName('adept-of-the-waves');
            this.cloud = this.player1.findCardByName('cloud-the-mind-2');
            this.matsu = this.player2.findCardByName('matsu-berserker');
        });

        it('should not be playable without a shugenja', function () {
            this.player1.clickCard(this.cloud);
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('should be playable with a shugenja', function () {
            this.player1.moveCard(this.adept, 'play area');
            this.player1.playAttachment(this.cloud, this.matsu);
            expect(this.cloud.location).toBe('play area');
            expect(this.matsu.attachments).toContain(this.cloud);
        });
    });
});

describe('Cloud the Mind 2 with Air affinity', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['young-philosopher'],
                    hand: ['cloud-the-mind-2']
                },
                player2: {
                    inPlay: ['matsu-berserker', 'yogo-preserver', 'doji-whisperer'],
                    hand: ['command-the-tributary']
                }
            });

            this.cloud = this.player1.findCardByName('cloud-the-mind-2');
            this.matsu = this.player2.findCardByName('matsu-berserker');
            this.tributary = this.player2.findCardByName('command-the-tributary');

            this.matsu.dishonor();
            this.matsu.fate = 1;
            this.player1.pass();
            this.player2.playAttachment(this.tributary, this.matsu);
        });

        it('removes gained keywords and gained abilities', function () {
            expect(this.matsu.hasSincerity()).toBe(true);
            this.player1.playAttachment(this.cloud, this.matsu);
            expect(this.matsu.hasSincerity()).toBe(false);

            this.player2.clickCard(this.matsu);
            expect(this.player2).toHavePrompt('Action Window');
        });
    });
});

