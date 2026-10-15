describe('Sake House Informant', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['sake-house-informant', 'shosuro-sadako', 'bayushi-aramoro'],
                    hand: ['adept-of-shadows']
                },
                player2: {
                    inPlay: ['midnight-prowler']
                }
            });

            this.sadako = this.player1.findCardByName('shosuro-sadako');
            this.aramoro = this.player1.findCardByName('bayushi-aramoro');
            this.adept = this.player1.findCardByName('adept-of-shadows');
            this.prowler = this.player2.findCardByName('midnight-prowler');
        });

        it('should give the right boost to the right people', function() {
            const sadako = { mil: this.sadako.militarySkill, pol: this.sadako.politicalSkill };
            const aramoro = { mil: this.aramoro.militarySkill, pol: this.aramoro.politicalSkill };
            const prowler = { mil: this.prowler.militarySkill, pol: this.prowler.politicalSkill };
            this.player1.player.imperialFavor = 'political';
            this.player2.player.imperialFavor = '';
            this.game.checkGameState(true);
            expect(this.sadako.militarySkill).toBe(sadako.mil);
            expect(this.sadako.politicalSkill).toBe(sadako.pol + 1);
            expect(this.aramoro.militarySkill).toBe(aramoro.mil);
            expect(this.aramoro.politicalSkill).toBe(aramoro.pol + 1);
            expect(this.prowler.militarySkill).toBe(prowler.mil);
            expect(this.prowler.politicalSkill).toBe(prowler.pol);

            this.player1.player.imperialFavor = 'military';
            this.player2.player.imperialFavor = '';
            this.game.checkGameState(true);
            expect(this.sadako.militarySkill).toBe(sadako.mil + 1);
            expect(this.sadako.politicalSkill).toBe(sadako.pol);
            expect(this.aramoro.militarySkill).toBe(aramoro.mil + 1);
            expect(this.aramoro.politicalSkill).toBe(aramoro.pol);
            expect(this.prowler.militarySkill).toBe(prowler.mil);
            expect(this.prowler.politicalSkill).toBe(prowler.pol);

            this.player1.player.imperialFavor = '';
            this.player2.player.imperialFavor = 'political';
            this.game.checkGameState(true);
            expect(this.sadako.militarySkill).toBe(sadako.mil);
            expect(this.sadako.politicalSkill).toBe(sadako.pol + 1);
            expect(this.aramoro.militarySkill).toBe(aramoro.mil);
            expect(this.aramoro.politicalSkill).toBe(aramoro.pol + 1);
            expect(this.prowler.militarySkill).toBe(prowler.mil);
            expect(this.prowler.politicalSkill).toBe(prowler.pol);

            this.player1.player.imperialFavor = '';
            this.player2.player.imperialFavor = 'military';
            this.game.checkGameState(true);
            expect(this.sadako.militarySkill).toBe(sadako.mil + 1);
            expect(this.sadako.politicalSkill).toBe(sadako.pol);
            expect(this.aramoro.militarySkill).toBe(aramoro.mil + 1);
            expect(this.aramoro.politicalSkill).toBe(aramoro.pol);
            expect(this.prowler.militarySkill).toBe(prowler.mil);
            expect(this.prowler.politicalSkill).toBe(prowler.pol);

            this.player1.clickCard(this.adept);
            this.player1.clickPrompt('0');

            expect(this.adept.militarySkill).toBe(3);
            expect(this.adept.politicalSkill).toBe(2);
        });
    });
});
