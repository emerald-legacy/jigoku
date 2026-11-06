describe('Water ring', function() {
    integration(function() {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['matsu-berserker', { card: 'doji-whisperer', attachments: ['stinger'] }, 'doji-challenger']
                },
                player2: {
                    inPlay: ['akodo-toturi']
                }
            });

            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.whisperer.bowed = true;
            this.whisperer.fate = 1;
            this.challenger.bowed = true;
            this.challenger.fate = 1;
        });

        it('cannot choose a bowed character that cannot be readied', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.berserker],
                defenders: [],
                ring: 'water'
            });
            this.noMoreActions();
            this.player1.clickPrompt('No');

            expect(this.player1).toHavePrompt('Water Ring');
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
        });
    });
});
