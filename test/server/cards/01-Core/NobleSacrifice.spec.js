describe('Noble Sacrifice', function() {
    integration(function() {
        describe('when its cost is prevented', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 5,
                        inPlay: ['doji-challenger'],
                        hand: ['noble-sacrifice']
                    },
                    player2: {
                        inPlay: ['akodo-kaede', 'bayushi-liar']
                    }
                });
                this.challenger = this.player1.findCardByName('doji-challenger');
                this.sacrifice = this.player1.findCardByName('noble-sacrifice');
                this.kaede = this.player2.findCardByName('akodo-kaede');
                this.liar = this.player2.findCardByName('bayushi-liar');
                this.challenger.honor();
                this.liar.dishonor();
                this.kaede.fate = 1;
            });

            it('is still put into the discard pile', function() {
                this.player1.clickCard(this.sacrifice);
                this.player1.clickCard(this.liar);
                this.player1.clickCard(this.challenger);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                this.player2.clickCard(this.kaede);
                expect(this.challenger.location).toBe('play area');
                expect(this.liar.location).toBe('play area');
                expect(this.sacrifice.location).toBe('conflict discard pile');
                expect(this.player1.fate).toBe(4);
            });
        });
    });
});
