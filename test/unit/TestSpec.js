/* Your tests are written here! 
** Writing a sample test to test the integration of jasmine and karma
** with Chrome, Firefox and PhantomJS
*/

describe('Calculator function to add two numbers', function() {	
   it('has a dummy spec to test 2 + 2', function() {
    // An intentionally passing test. Valid values 2+2 within expect() will equal 4.
    expect(2 + 2).toEqual(45);
  });
   it('has a dummy spec to test 2 + 2', function() {
    // An intentionally failing test. No code within expect() will never equal 4.
    expect(4).toEqual(4);
  }); 
});