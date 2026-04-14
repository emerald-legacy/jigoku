describe('Chronicles of Valor', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['togashi-yokuni', 'mercenary-company', 'mercenary-company', 'mercenary-company'],
                    hand: ['chronicles-of-valor'],
                    dynastyDiscard: ['ikoma-kiyono']
                },
                player2: {
                    inPlay: ['matsu-berserker', 'mercenary-company', 'mercenary-company', 'mercenary-company']
                }
            });
            this.yokuni = this.player1.findCardByName('togashi-yokuni');
            this.ikomaKiyono = this.player1.findCardByName('ikoma-kiyono', 'dynasty discard pile');
            this.mercs = this.player1.player.cardsInPlay.filter((c) => c.name === 'Mercenary Company');
            this.matsuBerserker = this.player2.findCardByName('matsu-berserker');
            this.p2Mercs = this.player2.player.cardsInPlay.filter((c) => c.name === 'Mercenary Company');
            this.chronicles = this.player1.findCardByName('chronicles-of-valor');
        });

        it('takes 1 honor when winning a conflict with total skill >= 25', function () {
            let p1Honor = this.player1.honor;
            let p2Honor = this.player2.honor;
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.yokuni, ...this.mercs],
                defenders: [this.matsuBerserker],
                jumpTo: 'afterConflict'
            });
            expect(this.player1).toHavePrompt('Any reactions?');
            this.player1.clickCard(this.chronicles);
            expect(this.player1.honor).toBe(p1Honor + 1);
            expect(this.player2.honor).toBe(p2Honor - 1);
        });

        it('takes 2 honor when controller has a Storyteller character', function () {
            this.player1.player.moveCard(this.ikomaKiyono, 'play area');
            let p1Honor = this.player1.honor;
            let p2Honor = this.player2.honor;
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.yokuni, ...this.mercs],
                defenders: [this.matsuBerserker],
                jumpTo: 'afterConflict'
            });
            expect(this.player1).toHavePrompt('Any reactions?');
            this.player1.clickCard(this.chronicles);
            expect(this.player1.honor).toBe(p1Honor + 2);
            expect(this.player2.honor).toBe(p2Honor - 2);
        });

        it('does not trigger when total skill is below 25', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.yokuni],
                defenders: [this.matsuBerserker],
                jumpTo: 'afterConflict'
            });
            this.player1.clickCard(this.chronicles);
            expect(this.chronicles.location).toBe('hand');
        });

        it('does not trigger when losing the conflict', function () {
            this.mercs.forEach((c) => (c.bowed = true));
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.yokuni],
                defenders: [this.matsuBerserker, ...this.p2Mercs],
                jumpTo: 'afterConflict'
            });
            this.player1.clickCard(this.chronicles);
            expect(this.chronicles.location).toBe('hand');
        });
    });
});
